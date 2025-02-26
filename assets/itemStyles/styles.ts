import { Platform, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  sightingItem: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: "100%", // Neem de volledige breedte van de parent
    maxWidth: 600, // Beperk de maximale breedte (pas dit aan naar wens)
    alignSelf: "center", // Centreer de container op grote schermen
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
  date: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
  },
  image: {
    width: "100%", // Neem de volledige breedte van de container
    aspectRatio: 4 / 3, // Behoud de verhoudingen (bijv. 16:9)
    borderRadius: 10,
    marginTop: 10,
    ...Platform.select({
      native: {
        resizeMode: "cover", // Behoud de verhoudingen op mobiel
      },
      web: {
        objectFit: "cover", // Behoud de verhoudingen op web
      },
    }),
  },
  imageContainer: {
    width: "100%", // Neem de volledige breedte van de parent
    maxWidth: 600, // Beperk de maximale breedte (pas dit aan naar wens)
    aspectRatio: 16 / 9, // Behoud de verhoudingen
    borderRadius: 10,
    marginTop: 10,
    overflow: "hidden", // Zorg ervoor dat de afbeelding binnen de container blijft
  },
  contact: {
    fontSize: 12,
    color: "#007BFF",
    marginTop: 5,
  },
});

export default styles;
