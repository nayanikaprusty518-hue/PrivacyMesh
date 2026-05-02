import spacy

try:
    nlp = spacy.load("en_core_web_sm")
    doc = nlp("Nayanika is a student at SRMIST in Chennai.")
    
    print("Entities found:")
    for ent in doc.ents:
        print(f"Text: {ent.text} | Label: {ent.label_}")
except Exception as e:
    print(f"Error: {e}")