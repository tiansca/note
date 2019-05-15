/**
 * Created by administrator on 2019/4/24.
 */
const getters = {
  usableNote(state){
    return state.noteArr.filter(note=>note.status==1)
  }
}

export default getters
