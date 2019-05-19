/**
 * Created by administrator on 2019/4/24.
 */
const getters = {
  usableNote(state){
    return state.noteArr.filter(note=>note.status==1)
  },
  collectNote(state){
    return state.noteArr.filter((note)=>{
      return note.status == 1 && note.collect == true
    })
  },
  labelNote:(state)=>(n)=>{
    console.log(n)
      if(n){
        return state.noteArr.filter((note)=>{
          return note.status == 1 && note.label == n;
        })
      }else {
        return state.noteArr.filter((note)=>{
          return note.status == 1;
        })
      }
  },
  usableLabel(state){
		console.log('标签变化')
    return state.labelArr.filter(label=>label.status==1)
  }
}

export default getters
