const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const AppleStrategy = require('passport-apple');
const User = require('../models/User');
const path = require('path');

module.exports = function(passport) {
  
  // =========================================================================
  // 1. LOCAL STRATEGY
  // =========================================================================
  passport.use(new LocalStrategy(
    { usernameField: 'email' }, 
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) return done(null, false, { message: 'Email not registered' });

        // Guard: If user registered via Social Login, they might not have a password
        if (!user.password) {
            return done(null, false, { message: 'Please log in using your Google/Apple account' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return done(null, false, { message: 'Password incorrect' });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  ));

  // // =========================================================================
  // // 2. GOOGLE STRATEGY
  // // =========================================================================
  // passport.use(new GoogleStrategy({
  //     clientID: process.env.GOOGLE_CLIENT_ID,
  //     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  //     callbackURL: "/api/auth/google/callback"
  //   },
  //   async (accessToken, refreshToken, profile, done) => {
  //     try {
  //       // A. Check if user exists by Google ID
  //       let user = await User.findOne({ googleId: profile.id });
  //       if (user) return done(null, user);

  //       // B. Check if user exists by Email (Account Linking)
  //       const email = profile.emails[0].value;
  //       user = await User.findOne({ email });

  //       if (user) {
  //         // Link Google ID to existing account
  //         user.googleId = profile.id;
  //         // Optional: Update avatar if they still have the default one
  //         if (user.avatar === 'https://i.pravatar.cc/150') {
  //            user.avatar = profile.photos[0].value;
  //         }
  //         await user.save();
  //         return done(null, user);
  //       }

  //       // C. Create New User
  //       // Note: We MUST generate a 'username' because your schema requires it.
  //       const generatedUsername = email.split('@')[0] + Math.floor(Math.random() * 10000);
        
  //       const newUser = new User({
  //         googleId: profile.id,
  //         email: email,
  //         username: generatedUsername, // Generated username
  //         avatar: profile.photos[0].value,
  //         // No password field
  //       });

  //       await newUser.save();
  //       return done(null, newUser);
  //     } catch (err) {
  //       return done(err, null);
  //     }
  //   }
  // ));

  // // =========================================================================
  // // 3. APPLE STRATEGY
  // // =========================================================================
  // passport.use(new AppleStrategy({
  //     clientID: process.env.APPLE_CLIENT_ID,
  //     teamID: process.env.APPLE_TEAM_ID,
  //     keyID: process.env.APPLE_KEY_ID,
  //     privateKeyLocation: path.join(__dirname, 'AuthKey.p8'), // Ensure this file exists
  //     callbackURL: "/api/auth/apple/callback",
  //     passReqToCallback: true // Needed to get profile on first login
  //   },
  //   async (req, accessToken, refreshToken, idToken, profile, done) => {
  //     try {
  //       const appleId = idToken.sub; // The unique Apple User ID
        
  //       // A. Check by Apple ID
  //       let user = await User.findOne({ appleId: appleId });
  //       if (user) return done(null, user);

  //       // B. Identify Email (Profile is only sent on FIRST login)
  //       const email = profile?.email || idToken.email;
        
  //       // If we can't get email and don't have user, we can't proceed
  //       if (!email) return done(new Error("Apple did not provide email"), null);

  //       // C. Check by Email (Account Linking)
  //       user = await User.findOne({ email: email });
  //       if (user) {
  //         user.appleId = appleId;
  //         await user.save();
  //         return done(null, user);
  //       }

  //       // D. Create New User
  //       const generatedUsername = email.split('@')[0] + Math.floor(Math.random() * 10000);
        
  //       const newUser = new User({
  //         appleId: appleId,
  //         email: email,
  //         username: generatedUsername,
  //         // Apple doesn't always provide an avatar, use default
  //       });

  //       await newUser.save();
  //       return done(null, newUser);

  //     } catch (err) {
  //       return done(err, null);
  //     }
  //   }
  // ));

  // =========================================================================
  // SERIALIZATION
  // =========================================================================
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};

// const LocalStrategy = require('passport-local').Strategy;
// const User = require('../models/User');

// module.exports = function(passport) {
//   // 1. Define the Local Strategy
//   passport.use(new LocalStrategy(
//     { usernameField: 'email' }, // We log in using email, not username
//     async (email, password, done) => {
//       try {
//         // Find user by email
//         const user = await User.findOne({ email });
//         if (!user) {
//           return done(null, false, { message: 'Email not registered' });
//         }

//         // Check password
//         const isMatch = await user.comparePassword(password);
//         if (!isMatch) {
//           return done(null, false, { message: 'Password incorrect' });
//         }

//         // Success
//         return done(null, user);
//       } catch (err) {
//         return done(err);
//       }
//     }
//   )); 

//   // 2. Serialize User (Store ID in session cookie)
//   passport.serializeUser((user, done) => {
//     done(null, user.id);
//   });

//   // 3. Deserialize User (Get full user object from ID in session)
//   passport.deserializeUser(async (id, done) => {
//     try {
//       const user = await User.findById(id);
//       done(null, user);
//     } catch (err) {
//       done(err);
//     }
//   });
// };