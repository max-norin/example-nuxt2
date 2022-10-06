import { unknownServerErrorToast } from '~/utils/errors/ServerError'

export default {
  data() {
    return {
      isLoadingData: false
    };
  },
  methods: {
    async loadData(propmises) {
      this.isLoadingData = true;
      try {
        await Promise.all(propmises);
      }catch (e) {
        debugger
        unknownServerErrorToast()
      } finally {
        this.isLoadingData = false;
      }
    },
  }
};
