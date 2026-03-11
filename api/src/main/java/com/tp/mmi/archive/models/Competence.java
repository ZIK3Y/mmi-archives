package com.tp.mmi.archive.models;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Competence {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long idCompetence;

    private String codeCompetence;
    private String libelle;

    @Column(columnDefinition = "TEXT")
    private String description;

    @OneToMany(mappedBy = "competence", cascade = CascadeType.ALL)
    private List<SaeCompetence> saeCompetences;

    public Competence() {}

    public Competence(String codeCompetence, String libelle, String description) {
        this.codeCompetence = codeCompetence;
        this.libelle = libelle;
        this.description = description;
    }

    public Long getIdCompetence() { return idCompetence; }
    public void setIdCompetence(Long idCompetence) { this.idCompetence = idCompetence; }
    public String getCodeCompetence() { return codeCompetence; }
    public void setCodeCompetence(String codeCompetence) { this.codeCompetence = codeCompetence; }
    public String getLibelle() { return libelle; }
    public void setLibelle(String libelle) { this.libelle = libelle; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public List<SaeCompetence> getSaeCompetences() { return saeCompetences; }
    public void setSaeCompetences(List<SaeCompetence> saeCompetences) { this.saeCompetences = saeCompetences; }
}
