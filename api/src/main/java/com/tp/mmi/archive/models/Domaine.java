package com.tp.mmi.archive.models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.util.List;

@Entity
public class Domaine {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long idDomaine;

    private String libelle;

    @Column(columnDefinition = "TEXT")
    private String description;

    // On ne sérialise PAS la liste des SAés depuis Domaine
    // (sinon Domaine → [Sae → Domaine → ...])
    @OneToMany(mappedBy = "domaine", cascade = CascadeType.ALL)
    @JsonManagedReference("domaine-saes")
    private List<Sae> saes;

    public Domaine() {}

    public Domaine(String libelle, String description) {
        this.libelle = libelle;
        this.description = description;
    }

    public Long getIdDomaine() { return idDomaine; }
    public void setIdDomaine(Long idDomaine) { this.idDomaine = idDomaine; }
    public String getLibelle() { return libelle; }
    public void setLibelle(String libelle) { this.libelle = libelle; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public List<Sae> getSaes() { return saes; }
    public void setSaes(List<Sae> saes) { this.saes = saes; }
}
