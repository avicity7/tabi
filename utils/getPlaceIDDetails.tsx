const getPlaceIDDetails = async (placeID) => {
  const response = await fetch('api/searchPlaceID', {
    method: 'POST',
    body: JSON.stringify(placeID)
  })

  const data = await response.json()

  return data.result
}

export default getPlaceIDDetails
