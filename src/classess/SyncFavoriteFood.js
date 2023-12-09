import moment from "moment"

export class SyncFavoriteFood {
    syncFavoriteFoodsByLocal = async(db , datas)=>{

        db.allDocs({include_docs : true}).then(recs=>{
          console.log("recs",recs)
          console.log("datas",datas)
          const records = recs.rows.map(item=>item.doc)
          let newRec = []
          let deletedItems = records.map(item=>({...item,_deleted : true}))
          console.log("records",records)
          
          datas.map(data=>{
            const index = records.findIndex(rec=>rec.foodId === data.foodId)
            if(index >= 0){
                newRec.push({...records[index] , ...data})
                deletedItems[index]=null
            }
            else{
                newRec.push(data)
            }
          })
    

          console.log("newRec",newRec)
          console.log("deletedItems",deletedItems)
          
          if(newRec.length>0){
            console.log("bulks",newRec)
            db.bulkDocs(newRec).then((res)=>{
              console.log("res",res)
              this.deleteExtraFoods(db , deletedItems.filter(item=>item!=null) )
            }).catch((error)=>{
              console.log("bulk error",error)
              this.deleteExtraFoods(db , deletedItems.filter(item=>item!=null))
            })
          }
          else{
            this.deleteExtraFoods(db , deletedItems.filter(item=>item!=null))
          }
         })
    }

    deleteExtraFoods = (db , deletedItems)=>{
        console.log("deletedItems",deletedItems)
        if(deletedItems.length>0){
            db.bulkDocs(deletedItems).then((res)=>{
            console.log("delete bulk res",res)
           
          }).catch((error)=>{
            console.log("delete bulk error",error)
           
          })
        }
    }
}