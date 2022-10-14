Parse.Cloud.define("getTipsOfItem", async (request) => {
  // get item
  let queryItem = new Parse.Query("Item");
  queryItem.equalTo("objectId", request.params.itemId);
  
  // get tips belonging to this item/its subcategory
  let queryTipSubcategory = new Parse.Query("TipSubcategory");
  queryTipSubcategory.matchesKeyInQuery("subcategory_id","subcategory_id", queryItem);
    
  // get tip data and translation
  let queryTipTL = new Parse.Query("TipTL");
  queryTipTL.matchesKeyInQuery("tip_id", "tip_id", queryTipSubcategory);
  queryTipTL.equalTo("language_code", request.params.languageCode);
  queryTipTL.include(["tip_id.tip_type_id"]);
    
  return await queryTipTL.find();
});