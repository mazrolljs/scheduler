//DineTime/context/UserContext.jsx
import React, { createContext, useContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../services/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

const AuthContext = createContext();

export const useUser = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export class AuthProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      role: null,
      loading: true,
    };
  }

  componentDidMount() {
    this.unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user data from Firestore
        const q = query(
          collection(db, "users"),
          where("uid", "==", firebaseUser.uid)
        );
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const userData = snapshot.docs[0].data();
          this.setState({
            user: { uid: firebaseUser.uid, ...userData },
            role: userData.role,
          });
          console.log("📄 AuthContext loaded user role:", userData.role);
        } else {
          console.warn(
            "⚠️ No Firestore profile found for UID:",
            firebaseUser.uid
          );
          this.setState({ user: firebaseUser, role: null });
        }
      } else {
        this.setState({ user: null, role: null });
      }
      this.setState({ loading: false });
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  render() {
    return (
      <AuthContext.Provider
        value={{
          user: this.state.user,
          role: this.state.role,
          loading: this.state.loading,
        }}
      >
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}
