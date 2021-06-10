

  const getLocationAddress = async (request, region) => {
    try {
      
      const geoLink = `https://api.opencagedata.com/geocode/v1/json?q=${region.latitude}%2C%20${region.longitude}&key=007c45636d1d4023ae4daabd42e15dec&language=en&pretty=1` 

      const data = await request(geoLink)
      const components = data.results[0].components
      const type = components["_type"]
      const name = components[type]
      const road = components['road']
      const houseNumber = components['house_number']
      console.log(type, name, road, houseNumber)
      return {type:type, name:name, road:road, houseNumber:houseNumber}
      
    } catch (error) {
      console.log("Error @Map/getLocationAddress: ", error.message)
    }
  }

  export default getLocationAddress