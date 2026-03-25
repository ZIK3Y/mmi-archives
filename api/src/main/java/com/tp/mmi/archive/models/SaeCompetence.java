package com.tp.mmi.archive.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@IdClass(SaeCompetenceId.class)
public class SaeCompetence {

    @Id
    @ManyToOne
    @JoinColumn(name = "id_sae")
    @JsonBackReference("sae-competences")
    private Sae sae;

    @Id
    @ManyToOne
    @JoinColumn(name = "id_competence")
    // Competence n'a pas de relation inverse vers SaeCompetence → pas besoin d'annotation ici
    private Competence competence;

    public SaeCompetence() {}

    public SaeCompetence(Sae sae, Competence competence) {
        this.sae = sae;
        this.competence = competence;
    }

    public Sae getSae() { return sae; }
    public void setSae(Sae sae) { this.sae = sae; }
    public Competence getCompetence() { return competence; }
    public void setCompetence(Competence competence) { this.competence = competence; }
}
