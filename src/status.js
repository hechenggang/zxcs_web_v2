
// 尝试集中管理属性

const status = {
        api:{
            login:"https://account.imhcg.cn/to/afdb06aa6a288b5eec4555d629477734",
            cover:"https://api.zxcs.imhcg.cn/static/cover@webp/",
            books:"https://api.zxcs.imhcg.cn/books",
            chapter:"https://api.zxcs.imhcg.cn/chapter",
            chapters:"https://api.zxcs.imhcg.cn/chapters",
            history:"https://api.zxcs.imhcg.cn/history",
        },
        page:{
            mybook:{
                keyword:"",
                show_search:false,
                show_history:false
            }
        },
        color:{
            reader:{
                "C1":["#1A2B3C","#FCFAF2"],
                "C2":["#CCCCCE","#444152"],
                "C3":["#EDBE68","#0B5D6B"],
            }
        },

        loading:false,
        books:[],
        history:{},
        before_url:""
    }

export default status