public with sharing class ScanProductController {

    @AuraEnabled
    public static Opportunity getOppDetails(Id oppId) {
        return [ SELECT
                Id,
                Name, 
                (
                    SELECT
                        Id,
                        PricebookEntry.Product2.Name,
                        PricebookEntry.Product2.ProductCode,
                        Quantity,
                        UnitPrice,
                        PricebookEntryId,
                        TotalPrice
                    FROM OpportunityLineItems
                )
            FROM Opportunity
            WHERE Id = :oppId
            LIMIT 1
        ];
    }
}
