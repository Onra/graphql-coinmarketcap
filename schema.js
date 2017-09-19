const fetch = require('node-fetch')

const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt
} = require('graphql')

const TickerType = new GraphQLObjectType({
    name: 'Ticker',
    description : 'a ticker',
    fields: {
        name: {
            type: GraphQLString,
            resolve: json => json.name
        },
        symbol: {
            type: GraphQLString,
            resolve: json => json.symbol
        }
    }
})

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        description: 'get a list of tickers',
        fields: {
            tickers: {
                type: new GraphQLList(TickerType),
                args: {
                    limit: { type: GraphQLInt }
                },
                resolve: (root, args) => fetch(
                    `https://api.coinmarketcap.com/v1/ticker/?limit=${args.limit}`
                )
                .then(response => response.json())
            }
        }
    })
})

module.exports = schema