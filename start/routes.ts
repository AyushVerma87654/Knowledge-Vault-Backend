/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import IndexController from '#controllers/indexController'
import SearchController from '#controllers/searchController'
import router from '@adonisjs/core/services/router'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})
router.get('/search/:query', [SearchController, 'search'])
router.post('/index', [IndexController, 'index'])
