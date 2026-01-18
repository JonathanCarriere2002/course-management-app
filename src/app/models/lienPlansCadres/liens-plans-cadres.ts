
/**
 * Plan-cadre 1 est celui qui est fait avant le plan-cadre 2 dans le cheminement
 */
export interface LiensPlansCadres {
  'id':number,
  'planCadre1': {
      'id': number,
      'code':string,
      'titre':string
    },
  'planCadre2':{
    'id': number,
    'code':string,
    'titre':string
  }
}
