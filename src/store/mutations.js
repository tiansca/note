/**
 * Created by administrator on 2019/4/23.
 */
const mutations = {
  setUserSession(state, n){
    state.user = n;
    localStorage.setItem('user', JSON.stringify(n));
  },
  removeUserSession(state){
    state.user = null;
    localStorage.removeItem('user');
  },
  setSlide(state){
    state.slideShow = !state.slideShow;
  },
  setGlobalBg(state,n){
    if(n === 0){
      state.globalBgColor = 'rgba(0,0,0,0)';
    }else {
      state.globalBgColor = 'rgba(0,0,0,0.2)';
    }
    state.globalBg = !state.globalBg;
  },
  setShowMore(state){
    state.showMore = !state.showMore
  },
  setLabelArr(state,n){
    state.labelArr = n;
    localStorage.setItem('labelArr', JSON.stringify(n))
  },
  setNoteArr(state,n,update){
    state.noteArr = n;
    localStorage.setItem('noteArr', JSON.stringify(n))
  },
  setShowType(state,n){
    if(state.showType == 1){
      state.showType = 0;
    }else {
      state.showType = 1;
    }
    localStorage.setItem('showType', state.showType);
  },
  setShowType1(state,n){
    state.showType = n;
    localStorage.setItem('showType', n);
  },
  setFilterType(state, n){
    state.filterType = n;
  },
    setOpenSearch(state){
      state.openSearch = ! state.openSearch
    },
    setLoading(state,n){
        state.isLoading = n
    },
    closeUpdate(state){
        state.update = false
    },
    setDevice(state, n){
        state.device_id = n;
        localStorage.setItem('device_id', n)
    },
    openUpdate(state){
        state.update = true
    },
    refresh(state){
        state.showPage = false;
        state.isLoading = true;
        setTimeout(()=>{
            state.showPage = true;
            state.isLoading = false;
            state.globalBg = false
        },1000)
    }
}

export default mutations
