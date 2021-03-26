export default interface ProductInterface {
    id: number,
    author: string,
    name: string,
    category_id: number,
    price: number,
    image: string,
    description: string
    quantity?: number,
    total_price?: number
    product_id?: number
}
