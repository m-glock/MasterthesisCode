Parse.Cloud.define("getBarcodeMaterials", async (request) => {
  // filter by municipality
  let queryMunicipality = new Parse.Query("Municipality");
  queryMunicipality.equalTo("objectId", request.params.municipalityId);
    
  let queryCategory = new Parse.Query("Category");
  queryCategory.matchesQuery("municipality_id", queryMunicipality);
    
  let queryBarcodeMaterial = new Parse.Query("BarcodeMaterial");
  queryBarcodeMaterial.matchesQuery("category_id", queryCategory);
    
  let queryBarcodeMaterialTL = new Parse.Query("BarcodeMaterialTL");
  queryBarcodeMaterialTL.matchesQuery("barcode_material_id", queryBarcodeMaterial);
  queryBarcodeMaterialTL.equalTo("language_code", request.params.languageCode);
  queryBarcodeMaterialTL.include("barcode_material_id");
  queryBarcodeMaterialTL.include(["barcode_material_id.category_id"]);
    
  return queryBarcodeMaterialTL.find();
});

Parse.Cloud.define("getSubcategoryOfItem", async (request) => {
    // get item with proper objectID
    let queryItem = new Parse.Query("Item");
    queryItem.equalTo("objectId", request.params.itemObjectId);
    
    let querySubcategoryTL = new Parse.Query("SubcategoryTL");
    querySubcategoryTL.matchesKeyInQuery("subcategory_id", "subcategory_id", queryItem);
    
    // get translation
    querySubcategoryTL.equalTo("language_code", request.params.languageCode);
    querySubcategoryTL.include("subcategory_id");
    
    return querySubcategoryTL.first();
});