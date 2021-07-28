var { graphqlHTTP } = require("express-graphql");
var { buildSchema, assertInputType } = require("graphql");
var express = require("express");

// Construct a schema, using GraphQL schema language
var restaurants = [
  {
    id: 1,
    name: "WoodsHill ",
    description:
      "American cuisine, farm to table, with fresh produce every day",
    dishes: [
      {
        name: "Swordfish grill",
        price: 27,
      },
      {
        name: "Roasted Broccily ",
        price: 11,
      },
    ],
  },
  {
    id: 2,
    name: "Fiorellas",
    description:
      "Italian-American home cooked food with fresh pasta and sauces",
    dishes: [
      {
        name: "Flatbread",
        price: 14,
      },
      {
        name: "Carbonara",
        price: 18,
      },
      {
        name: "Spaghetti",
        price: 19,
      },
    ],
  },
  {
    id: 3,
    name: "Karma",
    description:
      "Malaysian-Chinese-Japanese fusion, with great bar and bartenders",
    dishes: [
      {
        name: "Dragon Roll",
        price: 12,
      },
      {
        name: "Pancake roll ",
        price: 11,
      },
      {
        name: "Cod cakes",
        price: 13,
      },
    ],
  },
];
var schema = buildSchema(`
type Query{
  restaurant(id: Int): restaurant
  restaurants: [restaurant]
},
type restaurant {
  id: Int
  name: String
  description: String
  dishes:[Dish]
}
type Dish{
  name: String
  price: Int
}
input restaurantInput{
  name: String
  description: String
  dishes: [dishesInput]
}
input dishesInput {
  price: Int
  name: String
}
type DeleteResponse{
  ok: Boolean!
}
type Mutation{
  setRestaurant(input: restaurantInput): restaurant
  deleteRestaurant(id: Int!): DeleteResponse
  editRestaurant(id: Int!, name: String!): restaurant
}
`);
// The root provides a resolver function for each API endpoint

var root = {
  restaurant: (arg) => {
    return restaurants[arg.id]
  },
  restaurants: () => {
    return restaurants
  },
  setRestaurant : ({input}) => {
    restaurants.push({name:input.name,description:input.description,dishes: [{price:JSON.parse(JSON.stringify(input.dishes))[0].price, name:JSON.parse(JSON.stringify(input.dishes))[0].name}]})
    console.log(JSON.parse(JSON.stringify(input.dishes))[0].price);
    return input
  },
  deleteRestaurant : ({id}) => {
    const ok = Boolean(restaurants[id]);
    let delr = restaurants[id];
    restaurants = restaurants.filter(item => item.name !== restaurants[id].name)
    console.log(id, restaurants);
    console.log(JSON.stringify(delr));
    return {ok};
  },
  editRestaurant: ({id, ...restaurant}) => {
    console.log(id, ...restaurants);
  if(!restaurants[id]) {
    throw new Error("restaurant doesn't exist")
  }
  restaurants[id] = {
  ...restaurants[id],...restaurant
  }
  return restaurants[id]
  }
};
var app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);
var port = 5500;
app.listen(5500, () => console.log("Running Graphql on Port:" + port));