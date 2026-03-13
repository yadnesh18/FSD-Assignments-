import { useState } from 'react'
import './App.css'

function App() {
  const [cart, setCart] = useState([])

  const products = [
    {
      id: 1,
      name: 'Bluetooth Headphones',
      price: 'Rs. 700',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    },
    {
      id: 2,
      name: 'Smart Watch',
      price: 'Rs. 1200',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    },
    {
      id: 3,
      name: 'Smart Camera',
      price: 'Rs. 2000',
      image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop',
    },
  ]

  const addToCart = (product) => {
    setCart([...cart, product])
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold text-blue-600">MyStore</div>

            <div className="flex gap-8 text-gray-700 font-medium">
              <a href="#">Home</a>
              <a href="#products">Shop</a>

              <button className="relative">
                Cart ({cart.length})
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Products */}
      <section id="products" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">
            Featured Products
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg overflow-hidden"
              >

                <div className="h-64 overflow-hidden bg-gray-200">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-6">

                  <h3 className="text-xl font-semibold mb-2">
                    {product.name}
                  </h3>

                  <p className="text-2xl font-bold text-blue-600 mb-4">
                    {product.price}
                  </p>

                  <button
                    onClick={() => addToCart(product)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
                  >
                    Add to Cart
                  </button>

                </div>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* Cart Section */}
      <section className="bg-gray-100 py-10 px-4">
        <div className="max-w-4xl mx-auto">

          <h2 className="text-3xl font-bold mb-6">
            Cart Items
          </h2>

          {cart.length === 0 ? (
            <p>No items in cart</p>
          ) : (
            <div className="space-y-4">

              {cart.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white p-4 rounded shadow"
                >
                  <div className="flex items-center gap-4">

                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />

                    <div>
                      <h4 className="font-semibold">{item.name}</h4>
                      <p>{item.price}</p>
                    </div>

                  </div>
                </div>
              ))}

            </div>
          )}

        </div>
      </section>
      {/* Footer */}
<footer className="bg-gray-900 text-gray-300 py-10 mt-auto">
  <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">

    {/* Store Info */}
    <div>
      <h3 className="text-xl font-bold text-white mb-4">MyStore</h3>
      <p className="text-sm">
        Your one-stop shop for premium gadgets and accessories.
        We bring quality products at the best prices.
      </p>
    </div>

    {/* Quick Links */}
    <div>
      <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
      <ul className="space-y-2">
        <li>
          <a href="#" className="hover:text-white transition">Home</a>
        </li>
        <li>
          <a href="#products" className="hover:text-white transition">Products</a>
        </li>
        <li>
          <a href="#" className="hover:text-white transition">Cart</a>
        </li>
      </ul>
    </div>

    {/* Contact */}
    <div>
      <h3 className="text-xl font-bold text-white mb-4">Contact</h3>
      <p className="text-sm">Email: support@mystore.com</p>
      <p className="text-sm">Location: Pune, India</p>
    </div>

  </div>

  {/* Bottom */}
  <div className="text-center text-sm text-gray-400 mt-8 border-t border-gray-700 pt-4">
    © {new Date().getFullYear()} MyStore. All rights reserved.
  </div>
</footer>

    </div>
  )
}

export default App