const NeedsService = {
  getAllNeeds(knex) {
    return knex.select("*").from("needs");
  },

  insertNeed(knex, newNeed) {
    return knex
      .insert(newNeed)
      .into("needs")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },

  getById(knex, id) {
    return knex.from("needs").select("*").where("id", id).first();
  },

  deleteNeed(knex, id) {
    return knex("needs").where({ id }).delete();
  },

  updateNeed(knex, id, newNeedFields) {
    return knex("needs").where({ id }).update(newNeedFields);
  },
};

module.exports = NeedsService;
