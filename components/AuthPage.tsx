import React, { useState } from 'react';
import SpecialServiceModal from './SpecialServiceModal';
import PhoneSupport from './PhoneSupport';

interface AuthPageProps {
  onComplete: (userInfo: { phone: string; plan: string; name: string; email?: string }) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'auth' | 'payment'>('auth');
  const [isLogin, setIsLogin] = useState(true);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');
  const [simpleCode, setSimpleCode] = useState('');
  const [showSpecialModal, setShowSpecialModal] = useState(false);

  const plans = [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: '$9.99',
      trialInfo: 'First 30 minutes FREE',
      features: [
        '8 activities per month',
        '90 minutes total session time',
        'Standard activities only',
        'Monthly activity calendar',
        'Email support'
      ]
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      price: '$24.99',
      trialInfo: 'First 30 minutes FREE',
      popular: true,
      features: [
        '25 activities per month',
        '4 hours total session time',
        'ALL activities + special features',
        'Content creation tools',
        'Priority phone support',
        'Advanced calendar & scheduling'
      ]
    }
  ];

  // Simple phone number formatting
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length >= 6) {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
    } else if (numbers.length >= 3) {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    }
    return numbers;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Very simple validation for seniors
    if (!phone || phone.length < 14) {
      alert('Please enter your complete phone number');
      return;
    }
    
    if (!isLogin && !name) {
      alert('Please enter your name');
      return;
    }

    // For existing users (login), check if they exist
    if (isLogin) {
      const savedUsers = JSON.parse(localStorage.getItem('daymaker_users') || '{}');
      const cleanPhone = phone.replace(/\D/g, '');
      
      // Pre-loaded test account for developer
      if (cleanPhone === '5551234567') {
        onComplete({
          phone: '(555) 123-4567',
          name: 'Test User',
          plan: 'premium',
          email: 'test@daymaker2day.com'
        });
        return;
      }
      
      if (savedUsers[cleanPhone]) {
        // User exists, complete login
        onComplete({
          phone: phone,
          name: savedUsers[cleanPhone].name,
          plan: savedUsers[cleanPhone].plan,
          email: savedUsers[cleanPhone].email || ''
        });
        return;
      } else {
        alert('Phone number not found. Please sign up first.\n\n💡 Testing? Use: (555) 123-4567');
        return;
      }
    }

    // For new users, go to payment selection
    setStep('payment');
  };

  const handlePayment = (planId: string) => {
    setSelectedPlan(planId);
    
    // Generate simple 4-digit access code for seniors
    const accessCode = Math.floor(1000 + Math.random() * 9000).toString();
    
    // Save user data
    const cleanPhone = phone.replace(/\D/g, '');
    const savedUsers = JSON.parse(localStorage.getItem('daymaker_users') || '{}');
    
    const userData = {
      name: name,
      phone: phone,
      email: email,
      plan: planId,
      accessCode: accessCode,
      signupDate: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };
    
    savedUsers[cleanPhone] = userData;
    localStorage.setItem('daymaker_users', JSON.stringify(savedUsers));
    
    // Show confirmation with access code
    alert(`Welcome ${name}! 

Your account is ready! 

📱 Your Phone: ${phone}
🔢 Your Easy Access Code: ${accessCode}
💰 Plan: ${plans.find(p => p.id === planId)?.name}

🎉 BONUS: Your first 30 minutes are FREE!
Then: ${plans.find(p => p.id === planId)?.price}/month

Keep this code safe! You can use either:
• Your phone number to sign in
• Your easy access code

Our billing team will contact you to set up payment after your free trial.

Contact: daymaker2day@gmail.com`);

    // Complete signup
    onComplete({
      phone: phone,
      name: name,
      plan: planId,
      email: email
    });
  };

  const handleQuickAccess = () => {
    if (!simpleCode || simpleCode.length !== 4) {
      alert('Please enter your 4-digit access code');
      return;
    }

    // Pre-loaded test account for developer
    if (simpleCode === '1234') {
      onComplete({
        phone: '(555) 123-4567',
        name: 'Test User',
        plan: 'premium',
        email: 'test@daymaker2day.com'
      });
      return;
    }

    const savedUsers = JSON.parse(localStorage.getItem('daymaker_users') || '{}');
    
    // Find user by access code
    for (const [phoneNumber, userData] of Object.entries(savedUsers)) {
      if ((userData as any).accessCode === simpleCode) {
        onComplete({
          phone: (userData as any).phone,
          name: (userData as any).name,
          plan: (userData as any).plan,
          email: (userData as any).email || ''
        });
        return;
      }
    }
    
    alert('Access code not found. Please check your code.\n\n💡 Testing? Use code: 1234');
  };

  if (step === 'payment') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 w-full max-w-4xl shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">
              Choose Your Plan
            </h1>
            <div className="bg-green-900/30 border border-green-400/50 rounded-lg p-3 mb-4">
              <h2 className="text-lg font-bold text-green-300">🎉 Try Before You Buy!</h2>
              <p className="text-green-200">First 30 minutes are FREE for all new members</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white/5 border border-white/10 rounded-xl p-6 transition-all hover:bg-white/10 ${
                  plan.popular ? 'border-cyan-400 shadow-cyan-500/20' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-4">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    <div className="text-sm font-semibold text-green-400 mb-1">{plan.trialInfo}</div>
                    <div>
                      <span className="text-3xl font-bold text-cyan-400">{plan.price}</span>
                      <span className="text-gray-300">/month</span>
                    </div>
                  </div>
                </div>

                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-300">
                      <span className="text-green-400">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePayment(plan.id)}
                  className={`w-full py-3 rounded-lg font-medium transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  Start Free Trial
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => setStep('auth')}
              className="text-cyan-400 hover:text-cyan-300"
            >
              ← Back to Sign In
            </button>
            <p className="text-gray-400 text-sm mt-4">
              🔒 Complete info required • 30min free trial • Personal billing call
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4 relative">
      {/* Special On-Site Service Button */}
      <button
        className="absolute top-6 left-6 w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center shadow-lg border-4 border-white/30 z-40 hover:scale-105 transition-transform"
        title="Special On-Site Service"
        onClick={() => setShowSpecialModal(true)}
      >
        <span className="text-3xl text-white font-bold">★</span>
      </button>

      {/* Special Service Modal */}
      <SpecialServiceModal
        isOpen={showSpecialModal}
        onClose={() => setShowSpecialModal(false)}
        userInfo={{ name, phone, email }}
      />

      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 w-full max-w-md shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 mb-4">
            DAYMAKER2DAY
          </h1>
          <p className="text-gray-300">
            {isLogin ? 'Welcome back!' : 'Join our community!'}
          </p>
        </div>

        {/* Easy 4-Digit Access Option */}
        <div className="mb-6 p-4 bg-green-900/20 border border-green-400/30 rounded-lg">
          <h3 className="text-green-300 font-semibold mb-2">Quick Access</h3>
          <p className="text-sm text-gray-300 mb-3">Have a 4-digit access code?</p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter 4-digit code"
              value={simpleCode}
              onChange={(e) => setSimpleCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
              className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 text-center text-lg tracking-widest"
              maxLength={4}
            />
            <button
              onClick={handleQuickAccess}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Go
            </button>
          </div>
        </div>

        <div className="text-center text-gray-400 mb-4">or</div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="(555) 123-4567"
              value={phone}
              onChange={handlePhoneChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 text-lg"
              required
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Your Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                required
              />
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email (Optional)
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
          >
            {isLogin ? 'Sign In' : 'Continue to Plans'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-cyan-400 hover:text-cyan-300"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>

        <div className="mt-6 p-4 bg-blue-900/20 border border-blue-400/30 rounded-lg">
          <h3 className="text-blue-300 font-semibold mb-2">User-Friendly Features</h3>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• No complex passwords needed</li>
            <li>• Phone number sign-in</li>
            <li>• 4-digit quick access codes</li>
            <li>• Personal billing support calls</li>
            <li>• Human customer service</li>
          </ul>
        </div>

        {/* Testing Information for Developer */}
        <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-400/30 rounded-lg">
          <h3 className="text-yellow-300 font-semibold mb-2">🔧 Developer Testing</h3>
          <div className="text-sm text-gray-300 space-y-1">
            <p><strong>Test Phone:</strong> (555) 123-4567</p>
            <p><strong>Test Code:</strong> 1234</p>
            <p><strong>Email:</strong> daymaker2day@gmail.com</p>
          </div>
        </div>

        {/* Voice-Only and Alternative Access */}
        <div className="mt-4 p-4 bg-orange-900/20 border border-orange-400/30 rounded-lg">
          <h3 className="text-orange-300 font-semibold mb-2">No Smartphone? No Problem!</h3>
          <div className="text-sm text-gray-300 space-y-2">
            <p><strong>📞 Phone-Only Access:</strong></p>
            <p>Call us at: <span className="text-orange-300 font-semibold">(555) DAYMAKER</span></p>
            <p className="text-xs">• Voice-only sessions available</p>
            <p className="text-xs">• We'll call you for activities</p>
            <p className="text-xs">• No internet required</p>
            
            <div className="mt-3 border-t border-orange-400/20 pt-2">
              <p><strong>🏠 Family Helper Setup:</strong></p>
              <p className="text-xs">Have a family member or friend sign you up and we'll handle everything by phone!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;