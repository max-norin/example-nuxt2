import Vue from 'vue'
import getMap from '@/utils/getMap'

export default class User extends Vue.extend({
  mixins: [],
  data () {},
  created () {},
  computed: {
    subordinateMap () {
      return getMap(this.subordinates, 'id')
    },
  },
  methods: {},
}) {}
