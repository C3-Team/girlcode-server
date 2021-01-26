const InventoriesService = {
  getAllInventories(knex) {
    return knex.select("*").from("inventories");
  },

  insertInventory(knex, newInventory) {
    return knex
      .insert(newInventory)
      .into("inventories")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },

  getById(knex, id) {
    return knex.from("inventories").select("*").where("id", id).first();
  },

  deleteInventory(knex, id) {
    return knex("inventories").where({ id }).delete();
  },

  updateInventory(knex, id, newInventoryFields) {
    return knex("inventories").where({ id }).update(newInventoryFields);
  },
};

module.exports = InventoriesService;
