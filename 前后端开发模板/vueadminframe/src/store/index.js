import Vue from 'vue';
import Vuex from 'vuex';
import admin from './modules/admin';
import routes from './modules/routes';

Vue.use(Vuex);

let store=new Vuex.Store({
    modules:{
        admin,
        routes
    }
})
export default store;
