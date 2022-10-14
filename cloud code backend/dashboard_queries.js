 Parse.Cloud.define("amountOfSearchedItems", async (request) => {
    let queryUser = new Parse.Query("User");
    queryUser.equalTo("objectId", request.params.userId);
    
    // get recent search history
    let querySearchHistory = new Parse.Query("SearchHistory");
    let items = await querySearchHistory.matchesQuery("user_id", queryUser).distinct("item_id");
    
    return items.length;
});

Parse.Cloud.define("amountOfWronglySortedItems", async (request) => {

    let queryUser = new Parse.Query("User");
    queryUser.equalTo("objectId", request.params.userId);
    
    // get recent search history
    let querySearchHistory = new Parse.Query("SearchHistory");
    querySearchHistory.matchesQuery("user_id", queryUser);
    querySearchHistory.equalTo("sorted_correctly", false);
    
    return (await querySearchHistory.distinct("item_id")).length;
});

Parse.Cloud.define("compareInNeighborhood", async (request) => {
    // get other users in neighborhood
    let queryZipCode = new Parse.Query("ZipCode");
    queryZipCode.containedIn("zip_code", request.params.zipCodes);
    let queryUser = new Parse.Query("User");
    queryUser.matchesQuery("zip_code_id", queryZipCode);

    let municipalityPointer = {
      __type: 'Pointer',
      className: 'Municipality',
      objectId: request.params.municipalityId
    }
    let queryUserMun = new Parse.Query("User");
    queryUserMun.equalTo("municipality_id", municipalityPointer);
    queryUserMun.equalTo("zip_code_id", null);
    
    let compoundUserQuery = Parse.Query.or(queryUser, queryUserMun);
    let usersInNeighborhood = await compoundUserQuery.find();
    
    // get ratio of searched/rescues items for user
    let userPointer = {
      __type: 'Pointer',
      className: '_User',
      objectId: request.params.userId
    }
    let querySearchHistory = new Parse.Query("SearchHistory");
    querySearchHistory.equalTo("user_id", userPointer);
    let searchHistory = await querySearchHistory.find();
      
    let correctlySortedAmount = 0;
    for(let i = 0; i < searchHistory.length; i++){
      let hasBeenSortedCorrectly = searchHistory[i].get("sorted_correctly");
      if(hasBeenSortedCorrectly) correctlySortedAmount++;
    }
    let myRatio = correctlySortedAmount / searchHistory.length;
      
    // compare to ratio of searched/rescues items for users in neighborhood
    let betterRatioAmount = 0;
    for(let index = 0; index < usersInNeighborhood.length; index++){
      let user = usersInNeighborhood[index];
      let querySearchHistory = new Parse.Query("SearchHistory");
      querySearchHistory.equalTo("user_id", user);
      let searchHistory = await querySearchHistory.find();
      
      let correctlySortedAmount = 0;
      for(let i = 0; i < searchHistory.length; i++){
        let hasBeenSortedCorrectly = searchHistory[i].get("sorted_correctly");
        if(hasBeenSortedCorrectly) correctlySortedAmount++;
      }
      let ratio = correctlySortedAmount / searchHistory.length;
      
      if(myRatio < ratio) betterRatioAmount++;
    }

    let percentage = (betterRatioAmount / usersInNeighborhood.length) * 100
    return percentage == 0 ? 10.0 : percentage;
});


Parse.Cloud.define("getRandomTip", async (request) => {
    let queryTips = new Parse.Query("Tip");
    let tipAmount = await queryTips.count();

    let randomNumber = Math.floor(Math.random() * tipAmount);
    let tip = await queryTips.skip(randomNumber).first();
    let queryTipTL = new Parse.Query("TipTL");
    queryTipTL.equalTo("tip_id", tip);
    queryTipTL.equalTo("language_code", request.params.languageCode);
    queryTipTL.include("tip_id");

    return await queryTipTL.first();
});