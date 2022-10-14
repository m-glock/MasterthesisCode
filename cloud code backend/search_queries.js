Parse.Cloud.define("recentlySearched", async (request) => {
  let queryUser = new Parse.Query("User");
  queryUser.equalTo("objectId", request.params.userId);
    
  // get recent search history
  let querySearchHistory = new Parse.Query("SearchHistory");
  querySearchHistory.matchesQuery("user_id", queryUser);
  querySearchHistory.descending("createdAt").limit(3);
    
  let items = await querySearchHistory.find();
  let pointers = items.map(item => item.get("item_id"));
    
  let queryItemTL = new Parse.Query("ItemTL");
  queryItemTL.containedIn('item_id', pointers);
  queryItemTL.equalTo("language_code", request.params.languageCode);
  return await queryItemTL.find();
});


Parse.Cloud.define("oftenSearched", async (request) => {
  let querySearchHistoryCount = new Parse.Query("SearchHistoryCount");
  querySearchHistoryCount.descending("search_amount").limit(3);
    
  let items = await querySearchHistoryCount.find();
  let pointers = items.map(item => item.get("item_id"));
    
  let queryItemTL = new Parse.Query("ItemTL");
  queryItemTL.containedIn('item_id', pointers);
  queryItemTL.equalTo("language_code", request.params.languageCode);
  return await queryItemTL.find();
});

Parse.Cloud.define("getRecentlyWronglySortedItem", async (request) => {
    let userPointer = {
      __type: 'Pointer',
        className: '_User',
        objectId: request.params.userId
    }
   
    let querySearchHistory = new Parse.Query("SearchHistory");
    querySearchHistory.equalTo("user_id", userPointer);
    querySearchHistory.descending("createdAt");
    querySearchHistory.equalTo("sorted_correctly", false);
    
    return (await querySearchHistory.first()).get("item_id").id;
});
