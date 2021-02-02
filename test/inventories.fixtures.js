function makeInventoriesArray() {
  return [
    {
      id: 1,
      user_name: "test user1",
      email: "this@yahoo.com",
      tampons: "3",
      pads: "5",
      inventory_location: "TX",
    },
    {
      id: 2,
      user_name: "test user2",
      email: "that@yahoo.com",
      tampons: "5",
      pads: "7",
      inventory_location: "AL",
    },
    {
      id: 3,
      user_name: "test user3",
      email: "those@yahoo.com",
      tampons: "15",
      pads: "5",
      inventory_location: "AR",
    },
    {
      id: 4,
      user_name: "test user4",
      email: "dabathose@yahoo.com",
      tampons: "8",
      pads: "6",
      inventory_location: "AZ",
    },
  ];
}

module.exports = {
  makeInventoriesArray,
};
