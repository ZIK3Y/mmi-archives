package com.tp.mmi.archive.models;

import java.io.Serializable;
import java.util.Objects;

public class GroupeSaeId implements Serializable {

    private Long groupe;
    private Long sae;

    public GroupeSaeId() {}

    public GroupeSaeId(Long groupe, Long sae) {
        this.groupe = groupe;
        this.sae = sae;
    }

    public Long getGroupe() { return groupe; }
    public void setGroupe(Long groupe) { this.groupe = groupe; }
    public Long getSae() { return sae; }
    public void setSae(Long sae) { this.sae = sae; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof GroupeSaeId)) return false;
        GroupeSaeId that = (GroupeSaeId) o;
        return Objects.equals(groupe, that.groupe) && Objects.equals(sae, that.sae);
    }

    @Override
    public int hashCode() { return Objects.hash(groupe, sae); }
}
