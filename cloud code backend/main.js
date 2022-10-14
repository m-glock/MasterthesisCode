require("./item_queries.js");
require("./search_queries.js");
require("./tip_queries.js");
require("./bookmark_queries_and_mutations.js");
require("./forum_queries.js");
require("./dashboard_queries.js");

Parse.Cloud.define('setUsersAcls', async(request) => {
  let currentUser = request.user;
  currentUser.setACL(new Parse.ACL(currentUser));
  return await currentUser.save(null, { useMasterKey: true });
});

Parse.Cloud.define("getDistinctSubcategoriesForCP", async (request) => {
  // filter by municipality
  let queryCollectionPoint = new Parse.Query("CollectionPoint");
  let queryMunicipality = new Parse.Query("Municipality");
    
  queryMunicipality.equalTo("objectId", request.params.municipalityId);
  queryCollectionPoint.matchesQuery("municipality_id", queryMunicipality);
    
  // get all entries in CollectionPointSubcategory for these collection points
  let queryCollectionPointSubcategory = new Parse.Query("CollectionPointSubcategory");
  queryCollectionPointSubcategory.matchesQuery("collection_point_id", queryCollectionPoint);
    
  // get the subcategories and their translation
  let querySubcategoryTL = new Parse.Query("SubcategoryTL");
  querySubcategoryTL.matchesKeyInQuery("subcategory_id", "subcategory_id", queryCollectionPointSubcategory);
  querySubcategoryTL.equalTo("language_code", request.params.languageCode);
    
  return querySubcategoryTL.find();
});