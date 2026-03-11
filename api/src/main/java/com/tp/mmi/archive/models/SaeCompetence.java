package com.tp.mmi.archive.models;

import jakarta.persistence.*;

@Entity
@IdClass(SaeCompetenceId.class)
public class SaeCompetence {

    @Id
    @ManyToOne
    @JoinColumn(name = "id_sae")
    private Sae sae;

    @Id
    @ManyToOne
    @JoinColumn(name = "id_competence")
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
