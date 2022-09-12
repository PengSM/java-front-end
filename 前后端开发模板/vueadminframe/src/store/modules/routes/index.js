let modules={
    namespaced:true,
    state:{
        //左侧栏目的数据源
        routesData:[]
    },
    mutations:{
        ["SET_ROUTES"](state,payload){
            state.routesData=payload.routesData;
        }
    },
    actions:{
        setRoutes(conText,payload){
            conText.commit("SET_ROUTES",{routesData:payload.routesData});
        }
    }
};

export default modules;
