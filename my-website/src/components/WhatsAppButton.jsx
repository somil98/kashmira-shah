export default function WhatsAppButton({ product, quantity = 1 }) {
  const phoneNumber = '+919653323093';
  
  const generateMessage = () => {
    const totalPrice = product.sellingPrice * quantity;
    return `Hi Kashmira, I'm interested in:\n- ${product.name} x ${quantity} @ ₹${product.sellingPrice} = ₹${totalPrice}`;
  };

  const handleClick = () => {
    const message = generateMessage();
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <button 
      onClick={handleClick}
      className="btn btn-whatsapp"
      type="button"
    >
      <i className="fab fa-whatsapp"></i> WhatsApp Me
    </button>
  );
}

