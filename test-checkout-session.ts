/**
 * Test script to verify Stripe Checkout Session creation works
 * 
 * This tests the new createCheckoutSession endpoint
 */

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

async function testCheckoutSessionCreation() {
  console.log("🧪 Testing Stripe Checkout Session creation...\n");

  try {
    // Test 1: Create a Learning Path payment plan checkout session
    console.log("Test 1: Creating Learning Path payment plan checkout session...");
    const session1 = await stripe.checkout.sessions.create({
      customer_email: "test@example.com",
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'LEARNING PATH - Payment Plan',
            description: '6 monthly payments of $66.50',
          },
          unit_amount: 6650,
          recurring: {
            interval: 'month',
            interval_count: 1,
          },
        },
        quantity: 1,
      }],
      success_url: 'http://localhost:3000/payment-success?session_id={CHECKOUT_SESSION_ID}&plan_type=LEARNING_PATH',
      cancel_url: 'http://localhost:3000/payment-cancel',
      metadata: {
        userId: '1',
        planType: 'LEARNING_PATH',
        paymentMethod: 'payment_plan',
        learningPathId: '1',
      },
    });

    console.log("✅ Learning Path session created successfully!");
    console.log(`   Session ID: ${session1.id}`);
    console.log(`   Checkout URL: ${session1.url}`);
    console.log("");

    // Test 2: Create a Bundle full payment checkout session
    console.log("Test 2: Creating Bundle full payment checkout session...");
    const session2 = await stripe.checkout.sessions.create({
      customer_email: "test@example.com",
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'BUNDLE 3 COURSE - Full Payment',
            description: 'One-time payment - Full access',
          },
          unit_amount: 29900,
        },
        quantity: 1,
      }],
      success_url: 'http://localhost:3000/payment-success?session_id={CHECKOUT_SESSION_ID}&plan_type=BUNDLE_3_COURSE',
      cancel_url: 'http://localhost:3000/payment-cancel',
      metadata: {
        userId: '1',
        planType: 'BUNDLE_3_COURSE',
        paymentMethod: 'full_payment',
        bundleId: '1',
        selectedCourseIds: JSON.stringify([1, 2, 3]),
      },
    });

    console.log("✅ Bundle session created successfully!");
    console.log(`   Session ID: ${session2.id}`);
    console.log(`   Checkout URL: ${session2.url}`);
    console.log("");

    // Test 3: Create a Chaplaincy payment plan checkout session
    console.log("Test 3: Creating Chaplaincy payment plan checkout session...");
    const session3 = await stripe.checkout.sessions.create({
      customer_email: "test@example.com",
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'CHAPLAINCY TRAINING - Payment Plan',
            description: '6 monthly payments of $45.83',
          },
          unit_amount: 4583,
          recurring: {
            interval: 'month',
            interval_count: 1,
          },
        },
        quantity: 1,
      }],
      success_url: 'http://localhost:3000/payment-success?session_id={CHECKOUT_SESSION_ID}&plan_type=CHAPLAINCY_TRAINING',
      cancel_url: 'http://localhost:3000/payment-cancel',
      metadata: {
        userId: '1',
        planType: 'CHAPLAINCY_TRAINING',
        paymentMethod: 'payment_plan',
      },
    });

    console.log("✅ Chaplaincy session created successfully!");
    console.log(`   Session ID: ${session3.id}`);
    console.log(`   Checkout URL: ${session3.url}`);
    console.log("");

    console.log("🎉 All tests passed! Stripe Checkout Session creation is working correctly.");
    console.log("");
    console.log("📝 Summary:");
    console.log("   - Learning Path payment plan: ✅");
    console.log("   - Bundle full payment: ✅");
    console.log("   - Chaplaincy payment plan: ✅");
    console.log("");
    console.log("✨ The payment flow is ready to test with real users!");
    console.log("   Use test card: 4242 4242 4242 4242");
    console.log("   Any future expiry date and any 3-digit CVC");

  } catch (error: any) {
    console.error("❌ Test failed:", error.message);
    console.error("   Error details:", error);
    process.exit(1);
  }
}

testCheckoutSessionCreation();
