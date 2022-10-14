Parse.Cloud.define("getAllItemBookmarksForUser", async (request) => {
    let queryBookmarkedItems = new Parse.Query("BookmarkedItems");
    
    // filter for user
    let queryUser = new Parse.Query("User");
    queryUser.equalTo("objectId", request.params.userId);
    
    queryBookmarkedItems.matchesQuery("user_id", queryUser);
    
    let queryItemTL = new Parse.Query("ItemTL");
    queryItemTL.matchesKeyInQuery("item_id", "item_id", queryBookmarkedItems);
    queryItemTL.equalTo("language_code", request.params.languageCode);
    
    return queryItemTL.find();
});

Parse.Cloud.define("getAllTipBookmarksForUser", async (request) => {
    let queryBookmarkedTips = new Parse.Query("BookmarkedTips");
    
    // filter for user
    let queryUser = new Parse.Query("User");
    queryUser.equalTo("objectId", request.params.userId);
    
    queryBookmarkedTips.matchesQuery("user_id", queryUser);
    
    let queryTipTL = new Parse.Query("TipTL");
    queryTipTL.matchesKeyInQuery("tip_id", "tip_id", queryBookmarkedTips);
    queryTipTL.equalTo("language_code", request.params.languageCode);
    
    return queryTipTL.find();
});

Parse.Cloud.define("getBookmarkStatusOfItem", async (request) => {
    let queryBookmarkedItems = new Parse.Query("BookmarkedItems");
    
    // filter for user and item combination
    let queryUser = new Parse.Query("User");
    queryUser.equalTo("objectId", request.params.userId);
    let queryItem = new Parse.Query("Item");
    queryItem.equalTo("objectId", request.params.itemObjectId);
    
    queryBookmarkedItems.matchesQuery("user_id", queryUser).matchesQuery("item_id", queryItem);
    
    return queryBookmarkedItems.first();
});

Parse.Cloud.define("getTipBookmarks", async (request) => {
    let queryBookmarkedTips = new Parse.Query("BookmarkedTips");
    
    // filter for user and item combination
    let queryUser = new Parse.Query("User");
    queryUser.equalTo("objectId", request.params.userId);
    //let queryTip = new Parse.Query("Tip");
    //queryTip.equalTo("objectId", request.params.tipId);
    
    queryBookmarkedTips.matchesQuery("user_id", queryUser);//.matchesQuery("tip_id", queryTip);
    
    return queryBookmarkedTips.find();
});

Parse.Cloud.define("deleteBookmarkedItem", async (request) => {
    let queryBookmarkedItems = new Parse.Query("BookmarkedItems");
    
    // filter for user and item combination
    let queryUser = new Parse.Query("User");
    queryUser.equalTo("objectId", request.params.userId);
    let queryItem = new Parse.Query("Item");
    queryItem.equalTo("objectId", request.params.itemId);
    
    queryBookmarkedItems.matchesQuery("user_id", queryUser).matchesQuery("item_id", queryItem);
    let bookmarkedItem = await queryBookmarkedItems.first();
    
    if(bookmarkedItem == null) return false;
    
    let BookmarkedItems = Parse.Object.extend("BookmarkedItems");
    let bookmarkedItems = new BookmarkedItems();
    bookmarkedItems.set("objectId", bookmarkedItem.id);

    let elementPointer = await bookmarkedItems.destroy();
    
    return elementPointer != null;
});

Parse.Cloud.define("createBookmarkedItem", async (request) => {
    let queryBookmarkedItems = new Parse.Query("BookmarkedItems");
    
    // filter for user and item combination
    let queryUser = new Parse.Query("User");
    queryUser.equalTo("objectId", request.params.userId);
    let queryItem = new Parse.Query("Item");
    queryItem.equalTo("objectId", request.params.itemId);
    
    queryBookmarkedItems.matchesQuery("user_id", queryUser).matchesQuery("item_id", queryItem);
  
    // only insert if item-user combination does not exist yet and return true
    // else return false
    let entryList = await queryBookmarkedItems.first();
    if(entryList == null){
      let BookmarkedItems = Parse.Object.extend("BookmarkedItems");
      let bookmarkedItems = new BookmarkedItems();
      let userPointer = {
        __type: 'Pointer',
        className: '_User',
        objectId: request.params.userId
      }
      let itemPointer = {
        __type: 'Pointer',
        className: 'Item',
        objectId: request.params.itemId
      }
      
      bookmarkedItems.set("user_id", userPointer);
      bookmarkedItems.set("item_id", itemPointer);
      await bookmarkedItems.save();
      return true;
    } else {
      return false;
    }
});

Parse.Cloud.define("deleteBookmarkedTip", async (request) => {
    let queryBookmarkedTips = new Parse.Query("BookmarkedTips");
    
    // filter for user and item combination
    let queryUser = new Parse.Query("User");
    queryUser.equalTo("objectId", request.params.userId);
    let queryTip = new Parse.Query("Tip");
    queryTip.equalTo("objectId", request.params.tipId);
    
    queryBookmarkedTips.matchesQuery("user_id", queryUser).matchesQuery("tip_id", queryTip);
    let bookmarkedTip = await queryBookmarkedTips.first();
    
    if(bookmarkedTip == null) return false;
    
    let BookmarkedTips = Parse.Object.extend("BookmarkedTips");
    let bookmarkedTips = new BookmarkedTips();
    bookmarkedTips.set("objectId", bookmarkedTip.id);

    let elementPointer = await bookmarkedTips.destroy();
    
    return elementPointer != null;
});

Parse.Cloud.define("createBookmarkedTip", async (request) => {
    let queryBookmarkedTips = new Parse.Query("BookmarkedTips");
    
    // filter for user and item combination
    let queryUser = new Parse.Query("User");
    queryUser.equalTo("objectId", request.params.userId);
    let queryTip = new Parse.Query("Tip");
    queryTip.equalTo("objectId", request.params.tipId);
    
    queryBookmarkedTips.matchesQuery("user_id", queryUser).matchesQuery("tip_id", queryTip);
  
    // only insert if item-user combination does not exist yet and return true
    // else return false
    let entryList = await queryBookmarkedTips.first();
    if(entryList == null){
      let BookmarkedTips = Parse.Object.extend("BookmarkedTips");
      let bookmarkedTips = new BookmarkedTips();
      let userPointer = {
        __type: 'Pointer',
        className: '_User',
        objectId: request.params.userId
      }
      let tipPointer = {
        __type: 'Pointer',
        className: 'Tip',
        objectId: request.params.tipId
      }
      
      bookmarkedTips.set("user_id", userPointer);
      bookmarkedTips.set("tip_id", tipPointer);
      await bookmarkedTips.save();
      return true;
    } else {
      return false;
    }
});