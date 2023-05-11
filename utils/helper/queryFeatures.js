class queryFeatures {
  constructor(query, demand) {
    this.query = query;
    this.demand = demand;
  }

  select() {
    if (this.demand.fields) {
      const fields = this.demand.fields.split(",");

      if (!fields.includes("__v")) fields.push("-__v");
      if (!fields.includes("createdAt")) fields.push("-createdAt");
      if (!fields.includes("updatedAt")) fields.push("-updatedAt");

      this.query = this.query.select(fields.join(" "));
    } else {
      this.query = this.query.select("-createdAt -updatedAt -__v");
    }
    return this;
  }

  includeDeleted() {
    this.query.$locals = { getDeleted: true };
    return this;
  }
}

export default queryFeatures;
