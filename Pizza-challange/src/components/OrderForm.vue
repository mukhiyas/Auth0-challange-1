<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="500px">

      <v-card>
        <v-card-title>
          <span class="text-h5">Please place your Order</span>
        </v-card-title>
        
        <v-card-text>
          <p>Select your size</p>
          <v-radio-group v-model="size.value" row>
            <v-radio v-for="option in size.options" :key="option.size" :color="color" :label="option.size" :value="option.size"></v-radio>
          </v-radio-group>

          <p>
            Choose your toppings!
          </p>
          <v-checkbox v-for="topping of toppings.options"
                      v-model="toppings.selected"
                      :key="topping"
                      :label="topping"
                      :color="color"
                      :value="topping">
          </v-checkbox>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="purple lighten-1" outlined @click="dialog = false">
            Cancel
          </v-btn>
          <v-btn color="purple lighten-1" outlined @click="submit()">
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  name: 'OrderForm',
  data() {
    return {
      dialog: false,
      color: 'blue',
      size: {
        value: 'Single Slice',
        options: [
          { size: 'Single Slice', price: 1 },
          { size: 'Small', price: 3 },
          { size: 'Medium', price: 5 },
          { size: 'Large', price: 8 },
          { size: 'X-Large', price: 10 },
        ]
      },
      toppings: {
        selected: [],
        options: [
          'Tandoori',
          'Pepperoni',
          'Chilli',
          'Mozeralla',
          'Salami',
          'Corn',
          'Jalapino',
          'Olive'
        ]
      }
    }
  },
  computed: {
    orderDetail() {
      let price = 0
      const size = this.size.options.find(x => x.size === this.size.value)
      price += size.price
      price += this.toppings.selected.length

      const detail = {
        size: this.size.value,
        toppings: this.toppings.selected,
        price
      }
      return detail
    }
  },
  methods: {
    show() {
      this.dialog = true
    },
    hide() {
      this.dialog = false
    },
    async submit() {
      try {
        const response = await this.postOrder()
        const apiMessage = `Success: the server responded with '${response.status}: ${response.statusText}'`
        console.warn(apiMessage, response.data)
        
        // emit event to send data back to parent for rendering
        const pizza = {
          item: `${this.size.value} ${this.toppings.selected.length > 0 ? '+ ' + this.toppings.selected.join(', ') : '' }`,
          price: `$${this.orderDetail.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}`      
        }
        this.$emit('submit-pizza-order', pizza)
      } catch (error) {
        const apiMessage = `Error: the server responded with '${error.response.status}: ${error.response.statusText}'`
        console.error(apiMessage, error)
      } finally {
        this.dialog = false
      }
    },
    async postOrder() {
      const accessToken = await this.$auth.getTokenSilently()
      // console.warn(accessToken)
      const options = {
        method: 'POST',
        url: 'https://order-pizza-api.herokuapp.com/api/orders',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        data: this.orderDetail
      }
      return await this.$http.request(options)
    }
  }
}
</script>