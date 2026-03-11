package com.tp.mmi.archive.models;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Groupe {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long idGroupe;

    private String nomGroupe;
    private String etudiant1;
    private String etudiant2;
    private String etudiant3;
    private String etudiant4;
    private String etudiant5;
    private String anneePromo;

    @OneToMany(mappedBy = "groupe", cascade = CascadeType.ALL)
    private List<GroupeSae> groupeSaes;

    public Groupe() {}

    public Groupe(String nomGroupe, String etudiant1, String etudiant2, String etudiant3,
                  String etudiant4, String etudiant5, String anneePromo) {
        this.nomGroupe = nomGroupe;
        this.etudiant1 = etudiant1;
        this.etudiant2 = etudiant2;
        this.etudiant3 = etudiant3;
        this.etudiant4 = etudiant4;
        this.etudiant5 = etudiant5;
        this.anneePromo = anneePromo;
    }

    public Long getIdGroupe() { return idGroupe; }
    public void setIdGroupe(Long idGroupe) { this.idGroupe = idGroupe; }
    public String getNomGroupe() { return nomGroupe; }
    public void setNomGroupe(String nomGroupe) { this.nomGroupe = nomGroupe; }
    public String getEtudiant1() { return etudiant1; }
    public void setEtudiant1(String etudiant1) { this.etudiant1 = etudiant1; }
    public String getEtudiant2() { return etudiant2; }
    public void setEtudiant2(String etudiant2) { this.etudiant2 = etudiant2; }
    public String getEtudiant3() { return etudiant3; }
    public void setEtudiant3(String etudiant3) { this.etudiant3 = etudiant3; }
    public String getEtudiant4() { return etudiant4; }
    public void setEtudiant4(String etudiant4) { this.etudiant4 = etudiant4; }
    public String getEtudiant5() { return etudiant5; }
    public void setEtudiant5(String etudiant5) { this.etudiant5 = etudiant5; }
    public String getAnneePromo() { return anneePromo; }
    public void setAnneePromo(String anneePromo) { this.anneePromo = anneePromo; }
    public List<GroupeSae> getGroupeSaes() { return groupeSaes; }
    public void setGroupeSaes(List<GroupeSae> groupeSaes) { this.groupeSaes = groupeSaes; }
}
