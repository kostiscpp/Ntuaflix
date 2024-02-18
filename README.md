# Οδηγίες Setup του Ntuaflix

- Κάνουμε clone το παρόν repository σε ένα περιβάλλον με εγκατεστημένα τα εξής πράγματα:
    nodejs
    npm (```bash sudo apt  install npm```)
    nextjs
- Τρέχουμε στον εξωτερικό φάκελο το αρχείο setup.sh
- Θέτουμε τον κωδικό του root στην mysql  σε root ή αν δεν θέλουμε, αλλάζουμε τον κωδικό στα αρχεία api/.env (DB_PASS) και back-end/.env (DB_PASS) στον κωδικό του root της mysql στο περιβάλλον μας
- Τρέχουμε, με την εξής σειρά τις παρακάτω εντολές στο terminal της mysql (υποθέτουμε ότι ανοίχτηκε από τον φάκελο data):
    source ddl_for_database.sql
    source dml_for_database_dump.sql
    source for_manual_testing.sql
- Για να τρέξουμε την εφαρμογή χρειαζόμαστε 3 terminals:
    1. Στον φάκελο back-end τρέχουμε την εντολή ```npm run dev```
    2. Στον φάκελο fronend/client τρέχουμε την εντολή ```npm run dev```
    3. Στον φάκελο api τρέχουμε την εντολή ```node server.js```

**Τι έχουμε καταφέρει?**
1. Το webapp τρέχει στην θύρα 3000 του localhost. Σημείωση: Όταν το τρέχουμε, ο browser πιθανότατα θα μας πετάξει κάποιο warning. Αυτό συμβαίνει επειδή το https certificate που χρησιμοποιούμε έχει φτιαχτεί τοπικά. Από τις advanced λειτουργίες αποδεχόμαστε το ρίσκο. (η εκφώνηση ζητούσε ρητά https διεπαφή οπότε θέσαμε σε https τόσο το backend όσο και το frontend)
2. Το backend, που εξηπυρετεί όλα τα requests που μπορεί να κάνει ο user τρέχουν στη θύρα 8080 του localhost
3. Στη θύρα 9887 του localhost, τρέχει το REST api το οποίο εξηπυρετεί κάποιες από τις ενέργειες του admin 

**Πώς συνδεόμαστε στην εφαρμογή**
1. Στο αρχείο for_manual_testing.sql έχουμε ορίσει 4 χρήστες. Εμάς μας ενδιαφέρουν κυρίως 2:
- username: user    password: user (ρόλος user)
- username: admin   password: admin (ρόλος admin)

**Λειτουργίες της εφαρμογής μας**
Θα γίνει παρουσίαση όλης της εφαρμογής μέσω video

**Documentation**
Στον φάκελο documentation μπορούμε να βρούμε τα εξής αρχεία που μας ενδιαφέρουν:
- final_diagrams.vpp (διαγράμματα Visual Paradigm)
- SRS_final.docx (το τελικό SRS αρχείο μας)

Template repository, used for NTUA/ECE Software Engineering, 2023-2024

Το αρχείο αυτό περιέχει οδηγίες για το στήσιμο του git repository που θα
χρησιμοποιήσετε.  Στο τέλος, θα το αντικαταστήσετε με το `README.md` που
θα περιγράφει το δικό σας project.