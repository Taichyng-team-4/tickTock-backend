import * as helper from "../helper/helper.js";

class queryFeatures {
  constructor(query, demand = {}) {
    this.query = query;
    this.demand = demand;
  }

  filter() {
    const queryObj = helper.removeObjKeys(this.demand, [
      "page",
      "sort",
      "limit",
      "fields",
      "pop",
      "deleted",
    ]);

    // Sanitize the mongoose operator
    const queryStr = helper.replaceMongooseOpt(queryObj, [
      "gte",
      "gt",
      "lte",
      "lt",
      "elemMatch",
      "exists",
    ]);

    this.query = this.query.find(queryStr);
    return this;
  }

  select() {
    let fields = [];
    if (this.demand.fields) fields = this.demand.fields.split(",");
    else fields = ["-createdAt", "-updatedAt", "-__v"];

    this.query = this.query.select(fields.join(" "));

    return this;
  }

  includeDeleted() {
    if (!!+this.demand.deleted) this.query.$locals = { getDeleted: true };
    return this;
  }

  includeExpired() {
    if (!!+this.demand.expired) this.query.$locals = { getExpired: true };
    return this;
  }

  sort() {
    if (this.demand.sort) {
      const sortBy = this.demand.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-updatedAt");
    }

    return this;
  }

  paginate() {
    const page = +this.demand.page || 1;
    const limit = +this.demand.limit || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }

  populate() {
    if (!this.demand.pop) return this;

    if (this.demand.pop.includes(".")) {
      this.query.populate(helper.generatePopulateObjects(this.demand.pop));
    } else {
      const popBy = this.demand.pop.split(",").join(" ");
      this.query.populate(popBy);
    }

    return this;
  }
}

export default queryFeatures;
