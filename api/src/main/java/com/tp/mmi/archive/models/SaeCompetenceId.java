package com.tp.mmi.archive.models;

import java.io.Serializable;
import java.util.Objects;

public class SaeCompetenceId implements Serializable {

    private Long sae;
    private Long competence;

    public SaeCompetenceId() {}

    public SaeCompetenceId(Long sae, Long competence) {
        this.sae = sae;
        this.competence = competence;
    }

    public Long getSae() { return sae; }

    public void setSae(Long sae) { this.sae = sae; }

    public Long getCompetence() { return competence; }
    
    public void setCompetence(Long competence) { this.competence = competence; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof SaeCompetenceId)) return false;
        SaeCompetenceId that = (SaeCompetenceId) o;
        return Objects.equals(sae, that.sae) && Objects.equals(competence, that.competence);
    }

    @Override
    public int hashCode() { return Objects.hash(sae, competence); }
}
