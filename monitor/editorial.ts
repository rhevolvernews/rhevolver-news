export const editorialRules = {
 priorities:["Iguala y Zona Norte","Todo Guerrero","México de alto impacto"],
 sourceOrder:["primary-official","reliable-secondary"],
 output:{hashtag:"#RhevolverMedia",byline:false,hookHeadline:true,avoidDeathWord:"muertos"},
 duplicatePolicy:"Only substantial verified updates may repeat a story",
 visuals:"Preserve original source URLs; never store media permanently",
 capufe:"Distinguish CAPUFE-operated toll roads from free federal roads; contrast free roads with Guardia Nacional Carreteras and authorities",
 sports:["Liga MX results","standings","transfers","injuries","sanctions","relevant club news","other major sports"],
 agenda:["events","concerts","festivals","fairs","exhibitions","family","gastronomy","culture","tourism","calls","courses","services"],
 valerioTrujano:{location:"Tepecoacuilco de Trujano, Guerrero",fields:["fillPercent","volumeHm3","level","release"],publishOnlyOnVerifiedChange:true}
} as const;
