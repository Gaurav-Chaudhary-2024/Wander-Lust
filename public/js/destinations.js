// Destinations Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
  
  // Destinations data - 24 handpicked destinations
  const destinations = [
    {
      id: 1,
      name: "Maldives",
      city: "Malé",
      description: "Paradise islands with crystal clear waters and overwater bungalows",
      rating: 4.9,
      price: "$2,499",
      duration: "7 days",
      bestTime: "November - April",
      activities: ["Snorkeling", "Diving", "Spa", "Water Sports"],
      images: [
        "https://images.unsplash.com/photo-1717723548012-a36bda812962?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1627270074457-296814074bb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1619382590986-e2ac189b0658?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1644007204960-3ce7bfff5306?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
      ]
    },
    {
      id: 2,
      name: "Switzerland",
      city: "Zermatt",
      description: "Breathtaking Alpine peaks and world-class skiing destinations",
      rating: 4.8,
      price: "$1,899",
      duration: "5 days",
      bestTime: "December - March, June - September",
      activities: ["Skiing", "Hiking", "Mountain Railways", "Photography"],
      images: [
        "https://images.unsplash.com/photo-1617256955938-598efba0ea5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1691028991676-99ce132ce560?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1550503736-c1a2c9033c03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1660773460673-e2bcb68e769d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
      ]
    },
    {
      id: 3,
      name: "France",
      city: "Paris",
      description: "The city of love with iconic landmarks and world-class cuisine",
      rating: 4.7,
      price: "$1,599",
      duration: "4 days",
      bestTime: "April - June, September - November",
      activities: ["Museums", "Fine Dining", "Architecture", "Shopping"],
      images: [
        "https://images.unsplash.com/photo-1553411702-525b1113475e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1722006523424-d1bc2c8bb08d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1561036114-78189ef9a613?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
      ]
    },
    {
      id: 4,
      name: "Kenya",
      city: "Nairobi",
      description: "Epic safari adventures and incredible wildlife encounters",
      rating: 4.9,
      price: "$3,299",
      duration: "10 days",
      bestTime: "June - October, December - March",
      activities: ["Safari", "Wildlife Photography", "Cultural Tours", "Balloon Rides"],
      images: [
        "https://images.unsplash.com/photo-1733542870144-2cebb0b7a1bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1578271887552-5ac3f8e9cb8a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1537396172275-b899d5195f8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1517118828960-de5ea37d8ae6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
      ]
    },
    {
      id: 5,
      name: "Japan",
      city: "Tokyo",
      description: "Modern metropolis blending traditional culture with cutting-edge technology",
      rating: 4.8,
      price: "$2,199",
      duration: "6 days",
      bestTime: "March - May, September - November",
      activities: ["Temple Visits", "Food Tours", "Cherry Blossoms", "Technology"],
      images: [
        "https://images.unsplash.com/photo-1682949387184-2982a800908f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1685191139194-1c9b67a8fa29?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1594349335663-c25034fb807b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
      ]
    },
    {
      id: 6,
      name: "Greece",
      city: "Santorini",
      description: "Stunning volcanic island with white-washed buildings and incredible sunsets",
      rating: 4.8,
      price: "$1,799",
      duration: "5 days",
      bestTime: "April - June, September - October",
      activities: ["Sunset Viewing", "Wine Tasting", "Beach Hopping", "Photography"],
      images: [
        "https://images.unsplash.com/photo-1633909198480-85595aa21285?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1587058745379-d17c450fdeee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1720502613973-9f0757e51732?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1631136098955-ea35ccc95d56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
      ]
    },
    {
      id: 7,
      name: "Indonesia",
      city: "Bali",
      description: "Tropical paradise with ancient temples, rice terraces, and pristine beaches",
      rating: 4.7,
      price: "$1,299",
      duration: "8 days",
      bestTime: "April - October",
      activities: ["Temple Tours", "Surfing", "Yoga Retreats", "Cultural Experiences"],
      images: [
        "https://images.unsplash.com/photo-1523539693385-e5e891eb4465?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1591559797549-4e7c32d85671?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1711241057822-c4697ba9963a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1746106091815-a3a9e780c1c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
      ]
    },
    {
      id: 8,
      name: "UAE",
      city: "Dubai",
      description: "Futuristic cityscape with luxury shopping, modern architecture, and desert adventures",
      rating: 4.6,
      price: "$1,999",
      duration: "4 days",
      bestTime: "November - March",
      activities: ["Shopping", "Desert Safari", "Skyscrapers", "Luxury Dining"],
      images: [
        "https://images.unsplash.com/photo-1735320864430-38153049e1e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1677935688755-7418d1819591?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1690623837469-611f752ca00a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1605882090044-aa9cbe6df29e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
      ]
    },
    {
      id: 9,
      name: "USA",
      city: "New York",
      description: "The city that never sleeps with iconic landmarks and vibrant urban culture",
      rating: 4.5,
      price: "$1,899",
      duration: "5 days",
      bestTime: "April - June, September - November",
      activities: ["Broadway Shows", "Museums", "Central Park", "Architecture"],
      images: [
        "https://images.unsplash.com/photo-1706938106454-c534136c74bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1627781247007-dacf4597550f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1658759625607-0d426ee3744e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1714632475191-388c80290e20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
      ]
    },
    {
      id: 10,
      name: "Iceland",
      city: "Reykjavik",
      description: "Land of fire and ice with glaciers, geysers, and spectacular northern lights",
      rating: 4.9,
      price: "$2,799",
      duration: "7 days",
      bestTime: "June - August, September - March",
      activities: ["Northern Lights", "Glacier Tours", "Hot Springs", "Photography"],
      images: [
        "https://images.unsplash.com/photo-1647292545204-1c537d2ffb71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1753005922337-a82813b6d014?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1755523617129-22a69cb9f10b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1670594394099-9f66a0d6f04f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
      ]
    },
    {
      id: 11,
      name: "Thailand",
      city: "Bangkok",
      description: "Vibrant street life, ornate temples, and world-famous floating markets",
      rating: 4.6,
      price: "$1,199",
      duration: "6 days",
      bestTime: "November - March",
      activities: ["Temple Tours", "Street Food", "Floating Markets", "Traditional Massage"],
      images: [
        "https://images.unsplash.com/photo-1693629756372-a82588038d03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1642391326189-46e163cad59f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1746260948447-c06796c0a901?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1550500471-082b3ff15e33?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
      ]
    },
    {
      id: 12,
      name: "Peru",
      city: "Cusco",
      description: "Ancient Incan heritage with majestic mountains and archaeological wonders",
      rating: 4.8,
      price: "$2,399",
      duration: "9 days",
      bestTime: "May - September",
      activities: ["Machu Picchu", "Hiking", "Cultural Tours", "Adventure Sports"],
      images: [
        "https://images.unsplash.com/photo-1610025074290-0b17f976484f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1545330785-15356daae141?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/flagged/photo-1557804523-e96415bf5445?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1578821365663-f6579c87f5bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
      ]
    },
    {
      id: 13,
      name: "Norway",
      city: "Bergen",
      description: "Dramatic fjords, northern lights, and pristine Nordic landscapes",
      rating: 4.9,
      price: "$3,299",
      duration: "8 days",
      bestTime: "June - August, September - March",
      activities: ["Fjord Cruises", "Northern Lights", "Hiking", "Photography"],
      images: [
        "https://images.unsplash.com/photo-1723390351482-21253e158c4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1505246464763-5f59c5b9a2d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1679769705477-47435d90155d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1685275295782-7328b62e40a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
      ]
    },
    {
      id: 14,
      name: "Australia",
      city: "Sydney",
      description: "Iconic harbor city with stunning beaches and vibrant cultural scene",
      rating: 4.7,
      price: "$2,599",
      duration: "7 days",
      bestTime: "September - November, March - May",
      activities: ["Harbor Cruise", "Beach Activities", "Wildlife", "Food & Wine"],
      images: [
        "https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
      ]
    },
    {
      id: 15,
      name: "Italy",
      city: "Rome",
      description: "Eternal city filled with ancient ruins, Renaissance art, and delicious cuisine",
      rating: 4.8,
      price: "$1,799",
      duration: "6 days",
      bestTime: "April - June, September - October",
      activities: ["Historical Tours", "Food Tours", "Art Museums", "Architecture"],
      images: [
        "https://images.unsplash.com/photo-1552832230-c0197dd311b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1531572753322-ad063cecc140?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1529260830199-42c24126f198?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1534484880914-8e3fa34d63f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
      ]
    },
    {
      id: 16,
      name: "Spain",
      city: "Barcelona",
      description: "Vibrant Mediterranean city famous for Gaudí architecture and beach lifestyle",
      rating: 4.7,
      price: "$1,599",
      duration: "5 days",
      bestTime: "May - June, September - October",
      activities: ["Architecture Tours", "Beach", "Tapas Tours", "Art Museums"],
      images: [
        "https://images.unsplash.com/photo-1583422409516-2895a77efded?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1562883676-8c7feb83f09b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1579282240050-352db0a14c21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
      ]
    },
    {
      id: 17,
      name: "Morocco",
      city: "Marrakech",
      description: "Enchanting city with vibrant souks, palaces, and Sahara Desert adventures",
      rating: 4.6,
      price: "$1,399",
      duration: "6 days",
      bestTime: "March - May, September - November",
      activities: ["Souk Shopping", "Desert Safari", "Historical Sites", "Traditional Cuisine"],
      images: [
        "https://images.unsplash.com/photo-1597212618440-806262de4f6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1591213373101-cb32b9e3a0e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1508123892734-5ef89d99b716?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1575548798194-cfbb9cf11c9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
      ]
    },
    {
      id: 18,
      name: "New Zealand",
      city: "Queenstown",
      description: "Adventure capital with stunning fjords, mountains, and outdoor activities",
      rating: 4.9,
      price: "$2,899",
      duration: "8 days",
      bestTime: "December - February, June - August",
      activities: ["Bungee Jumping", "Hiking", "Skiing", "Scenic Flights"],
      images: [
        "https://images.unsplash.com/photo-1469521669194-babb0fd5cc74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1589802829985-817e51171b92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1518364538800-6bae3c2ea0f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
      ]
    },
    {
      id: 19,
      name: "Egypt",
      city: "Cairo",
      description: "Ancient civilization with pyramids, sphinx, and Nile River cruises",
      rating: 4.7,
      price: "$1,699",
      duration: "7 days",
      bestTime: "October - April",
      activities: ["Pyramid Tours", "Nile Cruise", "Museums", "Historical Sites"],
      images: [
        "https://images.unsplash.com/photo-1568322445389-f64ac2515020?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1553913861-c0fddf2619ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
      ]
    },
    {
      id: 20,
      name: "Portugal",
      city: "Lisbon",
      description: "Charming coastal capital with historic neighborhoods and stunning viewpoints",
      rating: 4.6,
      price: "$1,499",
      duration: "5 days",
      bestTime: "March - May, September - October",
      activities: ["Historic Tours", "Tram Rides", "Beach", "Food & Wine"],
      images: [
        "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1588546506449-78d2d2b2fbb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1609156934927-640d0c467f0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
      ]
    },
    {
      id: 21,
      name: "Vietnam",
      city: "Hanoi",
      description: "Cultural capital with ancient temples, street food culture, and natural beauty",
      rating: 4.5,
      price: "$1,099",
      duration: "7 days",
      bestTime: "October - April",
      activities: ["Street Food Tours", "Temple Visits", "Ha Long Bay", "Cultural Experiences"],
      images: [
        "https://images.unsplash.com/photo-1583417319070-4a69db38a482?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1528127269322-539801943592?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1600402347627-acf73b53c35e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
      ]
    },
    {
      id: 22,
      name: "Canada",
      city: "Vancouver",
      description: "Coastal city surrounded by mountains with diverse culture and outdoor activities",
      rating: 4.7,
      price: "$1,999",
      duration: "6 days",
      bestTime: "June - September",
      activities: ["Hiking", "City Tours", "Whale Watching", "Food Scene"],
      images: [
        "https://images.unsplash.com/photo-1508614999368-9260051292e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1601662528567-526cd06f6582?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1519832979-6fa011b87667?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
      ]
    },
    {
      id: 23,
      name: "Singapore",
      city: "Singapore",
      description: "Futuristic garden city with diverse cuisine and world-class attractions",
      rating: 4.6,
      price: "$1,799",
      duration: "4 days",
      bestTime: "February - April",
      activities: ["Gardens by the Bay", "Food Tours", "Shopping", "Marina Bay"],
      images: [
        "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1496939376851-89342e90adcd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1562992531-d46a8fdf3c86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
      ]
    },
    {
      id: 24,
      name: "South Africa",
      city: "Cape Town",
      description: "Stunning coastal city with Table Mountain, wine lands, and diverse wildlife",
      rating: 4.8,
      price: "$2,199",
      duration: "8 days",
      bestTime: "November - March",
      activities: ["Table Mountain", "Wine Tasting", "Safari", "Beaches"],
      images: [
        "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1484318571209-661cf29a69c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1535681448649-d2f5c88e9c90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "https://images.unsplash.com/photo-1523805009345-7448845a9e53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
      ]
    }
  ];

  // Render destinations
  function renderDestinations() {
    const grid = document.getElementById('destinationsGrid');
    if (!grid) return;

    grid.innerHTML = destinations.map((dest, index) => `
      <div class="destination-card" data-index="${index}" style="animation-delay: ${index * 0.1}s">
        <div class="destination-carousel">
          <div class="carousel-images" id="carousel-${dest.id}">
            ${dest.images.map(img => `
              <img src="${img}" alt="${dest.name}" class="carousel-image">
            `).join('')}
          </div>
          <div class="carousel-controls">
            <button class="carousel-btn carousel-prev" data-dest-id="${dest.id}">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button class="carousel-btn carousel-next" data-dest-id="${dest.id}">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
          <div class="carousel-indicators" id="indicators-${dest.id}">
            ${dest.images.map((_, i) => `
              <div class="carousel-indicator ${i === 0 ? 'active' : ''}" data-index="${i}"></div>
            `).join('')}
          </div>
        </div>
        <div class="destination-content">
          <div class="destination-header">
            <div>
              <h3 class="destination-name">${dest.name}</h3>
              <p class="destination-city">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                ${dest.city}
              </p>
            </div>
            <div class="destination-rating">
              <span>⭐</span>
              <span>${dest.rating}</span>
            </div>
          </div>
          <p class="destination-description">${dest.description}</p>
          <div class="destination-info">
            <div class="destination-info-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              ${dest.duration}
            </div>
            <div class="destination-info-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              ${dest.bestTime}
            </div>
          </div>
          <div class="destination-price">${dest.price}</div>
          <div class="destination-activities">
            ${dest.activities.map(activity => `
              <span class="activity-tag">${activity}</span>
            `).join('')}
          </div>
          <button class="btn btn-primary" style="width: 100%;" onclick="handleBookNow('${dest.name}', '${dest.city}', '${dest.price.replace('$', '').replace(',', '')}')">
            Book Now
          </button>
        </div>
      </div>
    `).join('');

    initializeCarousels();
  }

  // Initialize carousels
  function initializeCarousels() {
    const carouselStates = {};

    destinations.forEach(dest => {
      carouselStates[dest.id] = { currentIndex: 0 };
    });

    // Previous button handlers
    document.querySelectorAll('.carousel-prev').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const destId = parseInt(btn.dataset.destId);
        const state = carouselStates[destId];
        const dest = destinations.find(d => d.id === destId);
        
        state.currentIndex = (state.currentIndex - 1 + dest.images.length) % dest.images.length;
        updateCarousel(destId, state.currentIndex);
      });
    });

    // Next button handlers
    document.querySelectorAll('.carousel-next').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const destId = parseInt(btn.dataset.destId);
        const state = carouselStates[destId];
        const dest = destinations.find(d => d.id === destId);
        
        state.currentIndex = (state.currentIndex + 1) % dest.images.length;
        updateCarousel(destId, state.currentIndex);
      });
    });
  }

  function updateCarousel(destId, index) {
    const carousel = document.getElementById(`carousel-${destId}`);
    const indicators = document.getElementById(`indicators-${destId}`);
    
    if (carousel) {
      carousel.style.transform = `translateX(-${index * 100}%)`;
    }
    
    if (indicators) {
      indicators.querySelectorAll('.carousel-indicator').forEach((indicator, i) => {
        indicator.classList.toggle('active', i === index);
      });
    }
  }

  // Handle Book Now button click
  window.handleBookNow = function(destinationName, city, price) {
    // Store destination info in sessionStorage to pre-fill booking form
    sessionStorage.setItem('selectedDestination', destinationName);
    sessionStorage.setItem('selectedCity', city);
    sessionStorage.setItem('selectedPrice', price);
    
    // Redirect to booking page
    window.location.href = '/booking';
  };

  // Initialize
  renderDestinations();
});
