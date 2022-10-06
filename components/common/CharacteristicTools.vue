<template>
  <div class="tools">
    <template v-if="marketplace_characteristic">
      <span v-if="marketplace_characteristic.required" title="Обязательный параметр">*</span>
      <span v-if="marketplace_characteristic.dictionary" title="Значения есть в словаре">#</span>
      <span v-if="marketplace_characteristic.use_only_dictionary_values" title="Значения только из словаря">!</span>
      <span v-if="marketplace_characteristic.is_number" title="Значение должно быть числом">N</span>
      <span v-if="marketplace_characteristic.max_count > 1" title="Максимальное кол-во знечений">{{ marketplace_characteristic.max_count }}</span>
      <span v-if="marketplace_characteristic.units" title="Единица измерения">{{ marketplace_characteristic.units[0] }}</span>
    </template>
  </div>
</template>

<script>
export default {
  name: 'CharacteristicTools',
  props: {
    marketplace_characteristic: { required: true },
  },
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

.tools {
  width: 80px;
  display: flex;
  justify-content: end;

  > span {
    padding: 3px;
  }
}

</style>
