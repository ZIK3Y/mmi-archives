package com.tp.mmi.archive.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@IdClass(GroupeSaeId.class)
public class GroupeSae {

    @Id
    @ManyToOne
    @JoinColumn(name = "id_groupe")
    @JsonBackReference("groupe-groupesaes")
    private Groupe groupe;

    @Id
    @ManyToOne
    @JoinColumn(name = "id_sae")
    @JsonBackReference("sae-groupesaes")
    private Sae sae;

    private float note;

    public GroupeSae() {}

    public GroupeSae(Groupe groupe, Sae sae, float note) {
        this.groupe = groupe;
        this.sae = sae;
        this.note = note;
    }

    public Groupe getGroupe() { return groupe; }

    public void setGroupe(Groupe groupe) { this.groupe = groupe; }

    public Sae getSae() { return sae; }

    public void setSae(Sae sae) { this.sae = sae; }

    public float getNote() { return note; }
    
    public void setNote(float note) { this.note = note; }
}
