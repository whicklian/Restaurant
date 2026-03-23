import React, { useState } from 'react';

const Menu = ({ addToCart }) => {
  const [activeTab, setActiveTab] = useState('all');

  const menuItems = [
    { id: 1, category: 'appetizers', title: 'Bruschetta', description: 'Toasted bread with tomatoes, basil, and balsamic glaze', price: 8.99, img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400' },
    { id: 2, category: 'appetizers', title: 'Crispy Calamari', description: 'Served with spicy marinara sauce', price: 12.99, img: 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=400' },
    { id: 3, category: 'mains', title: 'Classic Burger', description: 'Beef patty, lettuce, tomato, special sauce', price: 14.99, img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', badge: 'Popular' },
    { id: 4, category: 'mains', title: 'Margherita Pizza', description: 'Fresh mozzarella, basil, olive oil', price: 18.99, img: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400' },
    { id: 5, category: 'mains', title: 'Pasta Carbonara', description: 'Creamy sauce, pancetta, parmesan', price: 16.99, img: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400' },
    { id: 6, category: 'desserts', title: 'Tiramisu', description: 'Classic Italian dessert with coffee', price: 7.99, img: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400' },
    { id: 7, category: 'desserts', title: 'New York Cheesecake', description: 'With berry compote', price: 8.99, img: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400' },
    { id: 8, category: 'drinks', title: 'House Red Wine', description: 'Glass of premium cabernet', price: 9.99, img: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400' },
    { id: 9, category: 'appetizers', title: 'Garlic Bread', description: 'Oven-baked bread with garlic butter and herbs', price: 5.99, img: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400' },
    { id: 10, category: 'mains', title: 'Grilled Steak', description: 'Prime beef cut served with mashed potatoes', price: 25.99, img: 'https://images.unsplash.com/photo-1544025162-8315ea070ffe?w=400' },
    { id: 11, category: 'desserts', title: 'Chocolate Lava Cake', description: 'Warm chocolate cake with a molten center', price: 9.99, img: 'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=400' },
    { id: 12, category: 'drinks', title: 'Fresh Mojito', description: 'Mint, lime, and rum', price: 8.99, img: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400' },
  ];

  const displayedItems = activeTab === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeTab);

  return (
    <section id="menu" className="container">
      <h2 className="section-title">Our Menu</h2>
      <p className="section-subtitle">Carefully crafted dishes for every palate</p>
      
      <div className="menu-tabs">
        {['all', 'appetizers', 'mains', 'desserts', 'drinks'].map(tab => (
          <div 
            key={tab}
            className={`menu-tab ${activeTab === tab ? 'active' : ''}`} 
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </div>
        ))}
      </div>

      <div className="menu-grid active">
        {displayedItems.map((item) => (
          <div 
            key={item.id} 
            className="menu-card" 
            onClick={() => addToCart(item)}
          >
            <img src={item.img} alt={item.title} />
            <div className="menu-info">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <span className="price">${item.price.toFixed(2)}</span>
                {item.badge && <span className="badge">{item.badge}</span>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Menu;
