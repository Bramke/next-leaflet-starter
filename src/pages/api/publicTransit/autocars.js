// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';

export default async (req, res) => {
  const eurolines = {
    name: "Eurolines",
    latitude: 51.057449,
    longitude: 3.739750,
    description: "Eurolines verzorgt dagelijks busdiensten naar meer dan 500 bestemmingen in Europa. Ook Gent is één van die bestemmingen. Je reis reserveren kan via de website.",
    website: "https://www.nationalexpress.com/en"
  }
  const flixbus = {
    name: "Flixbus",
    latitude: 51.053610,
    longitude: 3.739570,
    description: "FlixBus biedt dagelijks busreizen aan naar honderden bestemmingen in Europa, waaronder Gent. Tickets kunnen voordelig geboekt worden via de website.",
    website: "https://www.flixbus.be/bus/gent"
  }
  const flibco = {
    name: "Flib­co",
    latitude: 51.035070,
    longitude: 3.708600,
    description: "Tien keer per dag rijdt een shuttlebus op en neer tussen de luchthaven van Charleroi via Gent naar Brugge. Daarmee is Gent ook bereikbaarder voor toeristen die via de luchthaven Brussels South (Charleroi) naar Vlaanderen komen.",
    website: "https://www.flibco.com"
  }
  const data = {
    eurolines,
    flixbus,
    flibco
  }
  res.statusCode = 200
  await res.json(data)
}
