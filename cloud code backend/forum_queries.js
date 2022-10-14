Parse.Cloud.define("getForumEntries", async (request) => {
  let queryZipCode = new Parse.Query("ZipCode");
  queryZipCode.containedIn("zip_code", request.params.zipCodes);
    
  // get forum entries of users with expected zip codes
  let queryUser = new Parse.Query("User");
  queryUser.matchesQuery("zip_code_id", queryZipCode);
  let queryForumEntry = new Parse.Query("ForumEntry");
  queryForumEntry.matchesQuery("user_id", queryUser);
    
  // get users with correct municipality but no zip code
  let municipalityPointer = {
    __type: 'Pointer',
    className: 'Municipality',
    objectId: request.params.municipalityId
  }
  let queryUserMun = new Parse.Query("User");
  queryUserMun.equalTo("municipality_id", municipalityPointer);
  queryUserMun.equalTo("zip_code_id", null);
  let queryForumEntryMun = new Parse.Query("ForumEntry");
  queryForumEntryMun.matchesQuery("user_id", queryUserMun);
    
  let compoundQuery = Parse.Query.or(queryForumEntry, queryForumEntryMun);
  compoundQuery.equalTo("parent_entry_id", null);
  compoundQuery.descending("createdAt");
  compoundQuery.include("user_id");
  compoundQuery.include("forum_entry_type_id");
    
  return compoundQuery.find();
});