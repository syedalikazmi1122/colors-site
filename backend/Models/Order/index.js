import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Svg',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    },
    customization: {
      type: Map,
      of: String // Store color customizations as key-value pairs
    },
    modifiedSvgContent: {
      type: String // Store the customized SVG content
    }
    ,
    dimensions: {
      width: {
      type: Number,
      required: true
      },
      height: {
      type: Number,
      required: true
      },
      units: {
      type: String,
      enum: ['cm', 'in', 'm'], // Define allowed u
      }
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled'],
    default: 'pending'
  },
  shippingAddress: {
    firstName: String,
    lastName: String,
    address: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  paymentInfo: {
    paymentId: String,
    paymentMethod: String,
    paymentStatus: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Order', orderSchema);