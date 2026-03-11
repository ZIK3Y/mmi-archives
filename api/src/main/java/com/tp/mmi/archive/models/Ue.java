package com.tp.mmi.archive.models;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Ue {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long idUe;

    private String codeUe;
    private String libelle;
    private int semestre;

    @OneToMany(mappedBy = "ue", cascade = CascadeType.ALL)
    private List<Sae> saes;

    public Ue() {}

    public Ue(String codeUe, String libelle, int semestre) {
        this.codeUe = codeUe;
        this.libelle = libelle;
        this.semestre = semestre;
    }

    public Long getIdUe() { return idUe; }
    public void setIdUe(Long idUe) { this.idUe = idUe; }
    public String getCodeUe() { return codeUe; }
    public void setCodeUe(String codeUe) { this.codeUe = codeUe; }
    public String getLibelle() { return libelle; }
    public void setLibelle(String libelle) { this.libelle = libelle; }
    public int getSemestre() { return semestre; }
    public void setSemestre(int semestre) { this.semestre = semestre; }
    public List<Sae> getSaes() { return saes; }
    public void setSaes(List<Sae> saes) { this.saes = saes; }
}
